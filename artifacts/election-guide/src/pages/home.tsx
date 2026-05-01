import { Link } from "wouter";
import { BookOpen, Clock, CheckSquare, Shield, HelpCircle, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function Countdown() {
  const targetDate = new Date("2025-01-31T00:00:00").getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-secondary/10 border-l-4 border-secondary p-6 rounded-r-lg max-w-xl mx-auto mb-12">
      <h3 className="text-lg font-semibold text-secondary-foreground mb-2 text-center">Upcoming: India State Elections</h3>
      <div className="flex justify-center gap-4 text-center">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map((unit) => (
          <div key={unit.label} className="flex flex-col">
            <span className="text-3xl font-mono font-bold text-primary">{String(unit.value).padStart(2, "0")}</span>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{unit.label}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">January 31, 2025</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 tracking-tight">
            Democracy, Explained Clearly.
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Your nonpartisan, citizen-first guide to understanding the election process in India. Know your rights, learn the timeline, and make your voice heard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="font-semibold">
              <Link href="/how-to-vote">Get Ready to Vote</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link href="/what-is-election">Understand the Process</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 bg-background flex-1">
        <div className="container mx-auto max-w-5xl">
          <Countdown />

          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-foreground">Quick Access</h2>
            <p className="text-muted-foreground mt-2">Everything you need to navigate the elections.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Learn", desc: "Understand how elections work.", icon: BookOpen, path: "/what-is-election", color: "bg-blue-50 text-blue-700" },
              { title: "Timeline", desc: "Follow the step-by-step journey.", icon: Clock, path: "/timeline", color: "bg-amber-50 text-amber-700" },
              { title: "Vote", desc: "Your practical voting guide.", icon: CheckSquare, path: "/how-to-vote", color: "bg-emerald-50 text-emerald-700" },
              { title: "Your Rights", desc: "Protect your democratic power.", icon: Shield, path: "/your-rights", color: "bg-purple-50 text-purple-700" },
            ].map((tile) => (
              <Link key={tile.title} href={tile.path} className="group block h-full">
                <div className="bg-card border rounded-xl p-6 h-full transition-all duration-200 hover:shadow-md hover:border-primary/30 flex flex-col">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${tile.color}`}>
                    <tile.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{tile.title}</h3>
                  <p className="text-muted-foreground text-sm flex-1">{tile.desc}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary">
                    Explore <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-16 bg-muted/50 rounded-xl p-6 md:p-8 text-center max-w-3xl mx-auto border">
            <HelpCircle className="w-8 h-8 text-secondary mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Have specific questions?</h3>
            <p className="text-muted-foreground mb-4">Chat with our AI guide to get instant answers about the election process, voter registration, and more.</p>
            <Button asChild>
              <Link href="/ask-the-guide">Ask The Guide</Link>
            </Button>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Note: This guide is available in English. State-specific portals may offer regional language support.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
