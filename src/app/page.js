import { Button } from "@/components/ui/button";
import Feed from "@/components/Feed";

export default function Home() {
  const feedItems = [
    {
      id: 1,
      title: "The Future of AI",
      source: "Tech Daily",
      description: "An in-depth look at how artificial intelligence is shaping our future and transforming industries across the globe.",
      imageUrl: "https://picsum.photos/seed/ai/800/600"
    },
    {
      id: 2,
      title: "Sustainable Living in 2024",
      source: "Eco Watch",
      description: "Practical tips and innovations for maintaining an eco-friendly lifestyle in today's fast-paced world.",
      imageUrl: "https://picsum.photos/seed/eco/800/600"
    },
    {
      id: 3,
      title: "The Rise of Remote Work",
      source: "Work Insider",
      description: "How companies are adapting to the new normal of distributed teams and virtual collaboration.",
      imageUrl: "https://picsum.photos/seed/work/800/600"
    },
    {
      id: 4,
      title: "Space Exploration Breakthroughs",
      source: "Space News",
      description: "Latest discoveries and achievements in space exploration and astronomical research.",
      imageUrl: "https://picsum.photos/seed/space/800/600"
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Simple Header */}
      <header className="border-b">
        <div className="container-tight flex h-14 items-center justify-between">
          <span className="font-semibold">Logo</span>
          <Button variant="ghost" size="sm">Menu</Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-8">
          <Feed items={feedItems} />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t">
        <div className="container-tight flex h-14 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            © 2024 Your Company
          </p>
        </div>
      </footer>
    </div>
  );
}
