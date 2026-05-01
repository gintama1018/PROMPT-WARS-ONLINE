import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Landmark, Map, FileText, Users, Building } from "lucide-react";

export default function WhatIsElection() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">What Is An Election?</h1>
        <p className="text-lg text-muted-foreground">
          An election is the foundation of democracy—a formal decision-making process by which a population chooses an individual to hold public office.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-secondary" />
            Types of Elections in India
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">General Elections (Lok Sabha)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Held every 5 years to elect Members of Parliament (MPs) who choose the Prime Minister.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">State Elections (Vidhan Sabha)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Held to elect Members of Legislative Assembly (MLAs) who form the state government and choose the Chief Minister.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Local Elections (Panchayat / Municipal)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Grassroots elections to elect local representatives like Sarpanch or Municipal Councilors.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">By-elections</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Special elections held to fill a political office that has become vacant between general elections.
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
            <BookOpenIcon className="w-6 h-6 text-secondary" />
            Key Terms Glossary
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="constituency">
              <AccordionTrigger className="text-left font-semibold">Constituency</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                A defined geographical area from which one representative is elected to the legislative body. India is divided into 543 parliamentary constituencies.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="ballot">
              <AccordionTrigger className="text-left font-semibold">Ballot</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                The device used to cast votes in an election. Historically a piece of paper, now largely replaced by EVMs in India.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="evm">
              <AccordionTrigger className="text-left font-semibold">EVM (Electronic Voting Machine)</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                A machine used to electronically record votes. It consists of a Control Unit and a Balloting Unit.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="candidate">
              <AccordionTrigger className="text-left font-semibold">Candidate</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                An individual who seeks to be elected to a public office. They can represent a political party or run independently.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="manifesto">
              <AccordionTrigger className="text-left font-semibold">Manifesto</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                A published declaration of the intentions, motives, or views of a political party or candidate prior to an election.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <section className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-serif font-semibold mb-6">Did You Know?</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">900M+</div>
              <p className="text-sm opacity-90">Eligible voters in India, making it the largest democracy in the world.</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">1M+</div>
              <p className="text-sm opacity-90">Polling stations set up to ensure no voter has to travel more than 2km.</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-secondary mb-2">1951</div>
              <p className="text-sm opacity-90">The year India's first general election was held, lasting over 4 months.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
