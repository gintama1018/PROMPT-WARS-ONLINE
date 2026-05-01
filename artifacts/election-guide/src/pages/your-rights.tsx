import { Shield, EyeOff, AlertOctagon, Phone, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function YourRights() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-bold text-primary mb-4">Your Rights As A Voter</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Democracy relies on free and fair elections. Know the protections guaranteed to you by law.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Scale className="w-5 h-5 text-primary" />
              Right to Vote Freely
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Every eligible citizen has the right to vote without coercion, intimidation, or undue influence. No one can force you to vote for a specific candidate.
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <EyeOff className="w-5 h-5 text-primary" />
              Secret Ballot
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            Who you vote for is completely confidential. No one has the right to ask you who you voted for, and the system is designed to keep your choice untraceable.
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertOctagon className="w-5 h-5 text-secondary" />
              NOTA (None of the Above)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            If you do not find any candidate suitable, you have the right to register a negative vote by pressing the NOTA button at the bottom of the EVM.
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="w-5 h-5 text-secondary" />
              Right to Complain
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground text-sm">
            You have the right to report malpractice, fake voting, or violations of the Model Code of Conduct directly to the Election Commission.
          </CardContent>
        </Card>
      </div>

      <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-serif font-bold text-destructive mb-4">Beware of Bribery</h2>
        <p className="text-foreground/90 mb-4">
          Offering or accepting cash, liquor, gifts, or any other freebies in exchange for votes is a criminal offense under the Representation of the People Act, 1951.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
          <li>Do not sell your vote. Your vote determines your future.</li>
          <li>Report instances of cash or liquor distribution immediately.</li>
          <li>Parties offering free transportation to the polling booth is also a violation.</li>
        </ul>
      </div>

      <div className="bg-card border rounded-xl p-8 text-center shadow-md">
        <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Voter Helpline</h2>
        <p className="text-muted-foreground mb-6">
          For any complaints, queries, or assistance regarding the electoral process, dial the toll-free National Voter Helpline.
        </p>
        <div className="inline-block bg-primary text-primary-foreground text-4xl font-mono font-bold py-3 px-8 rounded-lg tracking-widest shadow-inner">
          1950
        </div>
      </div>
    </div>
  );
}
