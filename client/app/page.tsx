export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
                <h1 className="text-6xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Tvi3W
                </h1>
                <p className="text-center text-xl text-muted-foreground mb-8">
                    AI-Powered Personal Assistant
                </p>
                <div className="flex justify-center gap-4">
                    <a
                        href="/dashboard"
                        className="rounded-lg bg-primary px-6 py-3 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
                    >
                        Get Started
                    </a>
                    <a
                        href="/about"
                        className="rounded-lg border border-input bg-background px-6 py-3 font-semibold hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </main>
    );
}
