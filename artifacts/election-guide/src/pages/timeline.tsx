import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Megaphone, Users, Landmark, AlertTriangle, Vote, Calculator, BarChart3 } from "lucide-react";

const timelineSteps = [
  {
    id: 1,
    title: "Election Announced",
    phase: "Preparation",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: Megaphone,
    description: "The Election Commission of India (ECI) announces the schedule. The Model Code of Conduct comes into effect immediately.",
    citizenAction: "Check if you are registered to vote and your details are correct.",
  },
  {
    id: 2,
    title: "Voter List Published",
    phase: "Registration",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: Users,
    description: "The final electoral roll is published. Only those on this list can vote.",
    citizenAction: "Search your name in the electoral roll. Last chance to enroll if you haven't.",
  },
  {
    id: 3,
    title: "Nomination Filed",
    phase: "Preparation",
    color: "bg-purple-100 text-purple-700 border-purple-300",
    icon: Landmark,
    description: "Candidates file their nomination papers, declaring their assets, criminal records, and educational background.",
    citizenAction: "Review the affidavits of candidates in your constituency to make an informed choice.",
  },
  {
    id: 4,
    title: "Campaigning",
    phase: "Campaign",
    color: "bg-amber-100 text-amber-700 border-amber-300",
    icon: Users,
    description: "Political parties and candidates hold rallies, distribute manifestos, and reach out to voters.",
    citizenAction: "Listen to candidates, read manifestos, but do not accept bribes or yield to intimidation.",
  },
  {
    id: 5,
    title: "Silence Period",
    phase: "Campaign",
    color: "bg-red-100 text-red-700 border-red-300",
    icon: AlertTriangle,
    description: "All campaigning must stop 48 hours before polling begins to give voters time to think peacefully.",
    citizenAction: "Reflect on your choices privately. Report any illegal campaigning to authorities.",
  },
  {
    id: 6,
    title: "Voting Day",
    phase: "Voting",
    color: "bg-emerald-100 text-emerald-700 border-emerald-300",
    icon: Vote,
    description: "Polling booths open. Citizens cast their votes using Electronic Voting Machines (EVMs) and VVPATs.",
    citizenAction: "Go to your assigned polling booth with an approved ID and cast your vote.",
  },
  {
    id: 7,
    title: "Counting",
    phase: "Results",
    color: "bg-slate-100 text-slate-700 border-slate-300",
    icon: Calculator,
    description: "EVMs are opened in the presence of candidates' representatives, and votes are counted securely.",
    citizenAction: "Follow the news for credible updates. Stay calm and respect the process.",
  },
  {
    id: 8,
    title: "Results Declared",
    phase: "Results",
    color: "bg-slate-100 text-slate-700 border-slate-300",
    icon: BarChart3,
    description: "The ECI officially declares the winners who will represent constituencies.",
    citizenAction: "Accept the democratic mandate. Hold the elected representatives accountable.",
  }
];

export default function Timeline() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl flex-1 flex flex-col">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Election Timeline</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          From announcement to results, understand the sequence of events in an Indian election and know when to act.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        {/* Timeline Path */}
        <div className="lg:w-1/3 flex flex-col gap-2 relative">
          <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-border -z-10 hidden lg:block" />
          {timelineSteps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-4 p-3 rounded-lg text-left transition-all ${
                activeStep === step.id
                  ? "bg-muted shadow-sm border border-border"
                  : "hover:bg-muted/50 border border-transparent"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 bg-background flex-shrink-0 ${
                activeStep >= step.id ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground"
              }`}>
                {activeStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bold text-sm">{step.id}</span>}
              </div>
              <div>
                <div className="font-semibold text-foreground">{step.title}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">{step.phase}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Detailed View */}
        <div className="lg:w-2/3 sticky top-24 w-full">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card border rounded-2xl p-8 shadow-lg"
          >
            {timelineSteps.filter(s => s.id === activeStep).map(step => (
              <div key={step.id}>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border ${step.color}`}>
                  <step.icon className="w-4 h-4" />
                  {step.phase} Phase
                </div>
                <h2 className="text-3xl font-serif font-bold mb-4">{step.title}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-2 tracking-wide">What Happens</h3>
                    <p className="text-lg leading-relaxed">{step.description}</p>
                  </div>
                  <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                    <h3 className="text-sm font-semibold uppercase text-primary mb-2 tracking-wide flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" /> Your Action
                    </h3>
                    <p className="font-medium text-primary-foreground/90 text-primary">{step.citizenAction}</p>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-between pt-6 border-t">
                  <button 
                    onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                    disabled={activeStep === 1}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    Previous Step
                  </button>
                  <button 
                    onClick={() => setActiveStep(Math.min(timelineSteps.length, activeStep + 1))}
                    disabled={activeStep === timelineSteps.length}
                    className="text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
