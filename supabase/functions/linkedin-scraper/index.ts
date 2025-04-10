
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

interface Job {
  id: string;
  title: string;
  company: string;
  logo?: string;
  location: string;
  salary?: string;
  description: string;
  postedDate?: string;
  jobType?: string;
  experienceLevel?: string;
  skills?: string[];
  isRemote?: boolean;
  applyUrl?: string;
  source?: 'linkedin' | 'indeed' | 'glassdoor';
}

interface ScrapeOptions {
  keywords: string;
  location?: string;
  limit?: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Default to software engineer in India if no parameters provided
    const { keywords = 'software engineer', location = 'India', limit = 10 } = await req.json();

    console.log(`Scraping LinkedIn jobs with keywords: ${keywords}, location: ${location}, limit: ${limit}`);

    const jobs = await scrapeLinkedInJobs({
      keywords,
      location,
      limit: Number(limit)
    });

    return new Response(
      JSON.stringify({ jobs }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error in scrapeLinkedInJobs:', error);

    return new Response(
      JSON.stringify({ 
        jobs: [],
        error: error.message || 'Failed to scrape LinkedIn jobs'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function scrapeLinkedInJobs(options: ScrapeOptions): Promise<Job[]> {
  console.log("Starting browser...");
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  console.log("Browser launched, opening new page");
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
  await page.setViewport({ width: 1366, height: 768 });

  try {
    // Always append India to the location if not already specified
    let searchLocation = options.location || 'India';
    if (!searchLocation.toLowerCase().includes('india') && searchLocation.trim() !== '') {
      searchLocation = `${searchLocation}, India`;
    }
    
    const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(options.keywords)}&location=${encodeURIComponent(searchLocation)}`;
    console.log(`Navigating to: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log("Page loaded, scrolling to load more jobs");

    // Scroll to load more jobs
    await autoScroll(page);
    console.log("Scrolling completed, extracting job data");

    // Extract job data
    const jobs = await page.evaluate((limit) => {
      const jobElements = Array.from(document.querySelectorAll('.jobs-search__results-list li'));
      const results: any[] = [];
      
      for (const element of jobElements.slice(0, limit)) {
        try {
          const title = element.querySelector('.base-search-card__title')?.textContent?.trim() || '';
          const company = element.querySelector('.base-search-card__subtitle')?.textContent?.trim() || '';
          const location = element.querySelector('.job-search-card__location')?.textContent?.trim() || '';
          const postedDate = element.querySelector('time')?.getAttribute('datetime') || '';
          const link = element.querySelector('a.base-card__full-link')?.getAttribute('href')?.split('?')[0] || '';
          const logo = element.querySelector('.artdeco-entity-image')?.getAttribute('src') || undefined;
          
          results.push({
            id: link.split('/').filter(Boolean).pop() || Math.random().toString(36).substring(2),
            title,
            company,
            location,
            postedDate,
            applyUrl: link,
            logo,
            description: '',
            isRemote: location.toLowerCase().includes('remote'),
            source: 'linkedin',
            requirements: [],
            type: "Full-time",
            posted: new Date(postedDate || Date.now()).toLocaleDateString(),
            salary: "Competitive"
          });
        } catch (e) {
          console.error('Error parsing job element:', e);
        }
      }
      return results;
    }, options.limit || 20);

    console.log(`Extracted ${jobs.length} job listings, now scraping descriptions`);

    // Scrape job descriptions (limit to first 5 for performance)
    const jobsWithDescriptions = jobs.slice(0, 5);
    for (const job of jobsWithDescriptions) {
      try {
        console.log(`Fetching description for job: ${job.title}`);
        await page.goto(job.applyUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        const description = await page.evaluate(() => {
          return document.querySelector('.description__text')?.textContent?.trim() || 
                 document.querySelector('.show-more-less-html__markup')?.textContent?.trim() || '';
        });
        job.description = description;
        
        // Get salary if available
        const salary = await page.evaluate(() => {
          return document.querySelector('.salary')?.textContent?.trim() || "Competitive";
        });
        job.salary = salary;
        
        // Extract requirements
        const requirements = await page.evaluate(() => {
          const skillElements = document.querySelectorAll('.job-details-skill-match-status-list li');
          return Array.from(skillElements).map(el => el.textContent?.trim() || '').filter(Boolean);
        });
        
        if (requirements.length > 0) {
          job.requirements = requirements;
        } else {
          // Fallback: extract keywords from description
          const keywords = description.split(/\s+/)
            .filter(word => word.length > 5)
            .filter((v, i, a) => a.indexOf(v) === i)
            .slice(0, 5);
          job.requirements = keywords;
        }
        
        // Add slight delay between requests
        console.log(`Description fetched, waiting before next request`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.error(`Error scraping description for ${job.title}:`, e);
        // Ensure job has requirements even if description scraping fails
        job.requirements = ["Experience required", "Communication skills", "Problem solving"];
      }
    }

    console.log(`Completed scraping ${jobsWithDescriptions.length} job descriptions`);
    
    // For remaining jobs, assign placeholder data
    for (let i = 5; i < jobs.length; i++) {
      jobs[i].description = "Please visit LinkedIn for the complete job description.";
      jobs[i].requirements = ["Visit LinkedIn", "For full requirements"];
    }

    return jobs;
  } catch (error) {
    console.error('Error in scrapeLinkedInJobs function:', error);
    throw error;
  } finally {
    console.log("Closing browser");
    await browser.close();
  }
}

async function autoScroll(page: any) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}
