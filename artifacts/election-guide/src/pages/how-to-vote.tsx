import { CheckCircle2, Download, ExternalLink, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowToVote() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12 print:hidden">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">How To Vote</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A clear, step-by-step guide to exercising your democratic right.
        </p>
      </div>

      {/* Print Header */}
      <div className="hidden print:block text-center mb-8 border-b pb-4">
        <h1 className="text-3xl font-serif font-bold mb-2">Voter Checklist</h1>
        <p>The People's Election Guide</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm">1</span>
              Check Eligibility
            </h2>
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>You must be an Indian citizen.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>You must be 18 years of age on the qualifying date (usually Jan 1st of the year).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>You must be a resident of the polling area.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span>You must be enrolled in the electoral roll.</span>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm">2</span>
              Register to Vote
            </h2>
            <div className="space-y-4">
              <p className="text-muted-foreground">If you meet the criteria but aren't registered, you need to fill <strong>Form 6</strong>.</p>
              <div className="flex flex-col sm:flex-row gap-4 print:hidden">
                <Button variant="outline" className="gap-2" asChild>
                  <a href="https://voters.eci.gov.in/" target="_blank" rel="noopener noreferrer">
                    Voters Service Portal <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-sm">3</span>
              Inside the Booth
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold text-lg mb-1">Step 1: Verification</h3>
                <p className="text-muted-foreground text-sm">First polling officer will check your name on the voter list and your ID proof.</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold text-lg mb-1">Step 2: Ink and Register</h3>
                <p className="text-muted-foreground text-sm">Second polling officer will ink your finger, give you a slip, and take your signature.</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold text-lg mb-1">Step 3: Deposit Slip</h3>
                <p className="text-muted-foreground text-sm">Hand the slip to the third polling officer who will activate the voting machine.</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold text-lg mb-1">Step 4: Vote</h3>
                <p className="text-muted-foreground text-sm">Go to the voting compartment. Press the blue button next to your chosen candidate. A red light will glow, and you will hear a beep.</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mt-6">
                <h4 className="font-bold text-blue-900 mb-2">What is VVPAT?</h4>
                <p className="text-sm text-blue-800">
                  Voter Verified Paper Audit Trail. After you press the button, look at the VVPAT machine window. 
                  A printed slip will appear for 7 seconds showing the serial number, name, and symbol of your chosen candidate before dropping into a sealed box. This verifies your vote was cast correctly.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar / Print view */}
        <div className="md:col-span-1">
          <div className="bg-muted/50 rounded-xl p-6 sticky top-24 border">
            <h3 className="font-serif font-bold text-xl mb-4">What to Bring</h3>
            <p className="text-sm text-muted-foreground mb-4">You MUST bring your Voter Slip AND one of the following original IDs:</p>
            <ul className="space-y-2 text-sm font-medium">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Voter ID Card (EPIC)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Aadhaar Card</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> PAN Card</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Driving License</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Passport</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> MGNREGA Job Card</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-muted-foreground" /> Bank/Post Office Passbook</li>
            </ul>

            <Button onClick={handlePrint} className="w-full mt-6 gap-2 print:hidden" variant="default">
              <Printer className="w-4 h-4" /> Print Checklist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
