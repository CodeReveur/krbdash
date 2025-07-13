"use client";

import Header, { ResearchesList } from "@/app/components/researches";
import AddResearch from "@/app/components/toggles/addResearch";
import ViewResearch from "@/app/components/toggles/viewResearch";
import { useState } from "react";

export default function Researches() {
  const [showAddResearch, setShowAddResearch] = useState(false);
  const [setupResearchId, setSetupResearchId] = useState<string | null>(null);

  const toggleAddResearch = () => {
    setShowAddResearch(true);
  };

  const closeAddResearch = () => {
    setShowAddResearch(false);
  };

  const handleResearchViewClick = (ResearchId: string) => {
    setSetupResearchId(ResearchId);
  };

  const closeResearchView = () => {
    setSetupResearchId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <Header onAddResearchClick={toggleAddResearch} />
        <ResearchesList onResearchView={handleResearchViewClick} />
        
        {showAddResearch && (
          <AddResearch onClose={closeAddResearch} />
        )}
        
        {setupResearchId !== null && (
          <ViewResearch ResearchId={setupResearchId} onClose={closeResearchView} />
        )}
      </div>
    </div>
  );
}