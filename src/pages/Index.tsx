
import React from "react";
import Navbar from "@/components/Navbar";
import JobFilterExample from "@/components/JobFilterExample";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Job Search Platform</h1>
        <JobFilterExample />
      </main>
    </div>
  );
};

export default Index;
