import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import ResumeAnalyzer from "@/components/ResumeAnalyzer";
import AccountConnector from "@/components/AccountConnector";
import MotivationalInsights from "@/components/MotivationalInsights";
import { 
  BarChart, PieChart, LineChart, Area, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Line, Pie, Cell 
} from "recharts";
import {
  BarChart2, ListChecks, Calendar, Clock, BriefcaseIcon, Building,
  CheckCircle, XCircle, AlertCircle, Settings, ChevronRight, ChevronLeft
} from "lucide-react";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Sample data for statistics
  const applicationStats = [
    { name: "Applied", value: 24 },
    { name: "Interviews", value: 8 },
    { name: "Offers", value: 3 },
    { name: "Rejected", value: 12 },
  ];
  
  const weeklyActivity = [
    { day: "Mon", applications: 3, interviews: 1 },
    { day: "Tue", applications: 5, interviews: 0 },
    { day: "Wed", applications: 2, interviews: 2 },
    { day: "Thu", applications: 6, interviews: 1 },
    { day: "Fri", applications: 4, interviews: 2 },
    { day: "Sat", applications: 1, interviews: 0 },
    { day: "Sun", applications: 0, interviews: 0 },
  ];
  
  const applicationsBySource = [
    { name: "LinkedIn", value: 12, color: "#0077B5" },
    { name: "Indeed", value: 8, color: "#003A9B" },
    { name: "Company Sites", value: 5, color: "#72B500" },
    { name: "Referrals", value: 3, color: "#FF6B00" },
    { name: "Other", value: 2, color: "#777777" },
  ];
  
  // Sample applications data
  const applications = [
    {
      id: 1,
      position: "Senior UX Designer",
      company: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      applied: "2 days ago",
      status: "interview",
      nextStep: "Technical Interview on May 15, 2023",
    },
    {
      id: 2,
      position: "Frontend Developer",
      company: "Google",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
      applied: "1 week ago",
      status: "applied",
      nextStep: "Waiting for response",
    },
    {
      id: 3,
      position: "Product Manager",
      company: "Spotify",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png",
      applied: "3 days ago",
      status: "rejected",
      nextStep: "Application not selected",
    },
    {
      id: 4,
      position: "Machine Learning Engineer",
      company: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png",
      applied: "5 days ago",
      status: "offer",
      nextStep: "Review offer by May 20, 2023",
    },
    {
      id: 5,
      position: "DevOps Engineer",
      company: "Microsoft",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png",
      applied: "1 day ago",
      status: "applied",
      nextStep: "Waiting for response",
    }
  ];
  
  // Upcoming interviews
  const interviews = [
    {
      id: 1,
      position: "Senior UX Designer",
      company: "Apple",
      logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
      date: "May 15, 2023",
      time: "2:00 PM",
      type: "Technical Interview",
    },
    {
      id: 2,
      position: "Machine Learning Engineer",
      company: "Netflix",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1200px-Netflix_2015_logo.svg.png",
      date: "May 18, 2023",
      time: "11:00 AM",
      type: "Final Interview",
    }
  ];
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-200">
            Applied
          </Badge>
        );
      case "interview":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200">
            Interview
          </Badge>
        );
      case "offer":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
            Offer
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-200">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 pt-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {applicationStats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <Card className="neo-card">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      i === 0 ? "bg-blue-100 text-blue-600" :
                      i === 1 ? "bg-amber-100 text-amber-600" :
                      i === 2 ? "bg-green-100 text-green-600" :
                      "bg-red-100 text-red-600"
                    }`}>
                      {i === 0 && <BriefcaseIcon className="h-5 w-5" />}
                      {i === 1 && <Calendar className="h-5 w-5" />}
                      {i === 2 && <CheckCircle className="h-5 w-5" />}
                      {i === 3 && <XCircle className="h-5 w-5" />}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Charts */}
          <div className="col-span-1 lg:col-span-2 space-y-8">
            <Card className="neo-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Weekly Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white',
                        border: '1px solid #f0f0f0',
                        borderRadius: '0.5rem',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="applications" name="Applications" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="interviews" name="Interviews" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Application Sources
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={applicationsBySource}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {applicationsBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #f0f0f0',
                          borderRadius: '0.5rem',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="neo-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Response Time
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart
                      data={[
                        { name: "Week 1", time: 5 },
                        { name: "Week 2", time: 7 },
                        { name: "Week 3", time: 3 },
                        { name: "Week 4", time: 4 },
                      ]}
                      margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" />
                      <YAxis unit=" days" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white',
                          border: '1px solid #f0f0f0',
                          borderRadius: '0.5rem',
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                        }}
                        formatter={(value) => [`${value} days`, 'Avg. Response Time']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="time" 
                        stroke="hsl(var(--accent))" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="space-y-8">
            <MotivationalInsights />
            <ResumeAnalyzer />
            <AccountConnector />
          </div>
        </div>
        
        <div className="space-y-8">
          <Card className="neo-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                Job Applications
              </CardTitle>
              <CardDescription>
                Showing {(currentPage - 1) * 5 + 1}-{Math.min(currentPage * 5, applications.length)} of {applications.length}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {applications.slice((currentPage - 1) * 5, currentPage * 5).map((application) => (
                  <div key={application.id} className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-secondary rounded-md flex items-center justify-center overflow-hidden">
                        {application.logo ? (
                          <img src={application.logo} alt={application.company} className="h-8 w-8 object-contain" />
                        ) : (
                          <Building className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{application.position}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{application.company}</span>
                          <span>•</span>
                          <span>Applied {application.applied}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {renderStatusBadge(application.status)}
                      <Button variant="ghost" size="sm" className="p-0">
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {applications.length > 5 && (
                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {Math.ceil(applications.length / 5)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(page => Math.min(page + 1, Math.ceil(applications.length / 5)))}
                    disabled={currentPage === Math.ceil(applications.length / 5)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="neo-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Interviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              {interviews.length > 0 ? (
                <div className="divide-y divide-border">
                  {interviews.map((interview) => (
                    <div key={interview.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-secondary rounded-md flex items-center justify-center overflow-hidden">
                          {interview.logo ? (
                            <img src={interview.logo} alt={interview.company} className="h-8 w-8 object-contain" />
                          ) : (
                            <Building className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{interview.position}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{interview.company}</span>
                            <span>•</span>
                            <span>{interview.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">{interview.date}</div>
                        <div className="text-sm text-muted-foreground">{interview.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming interviews</h3>
                  <p className="text-muted-foreground">
                    When you schedule interviews, they'll appear here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
