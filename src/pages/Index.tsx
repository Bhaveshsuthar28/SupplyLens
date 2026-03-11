import { Link } from "react-router-dom";
import { BarChart3, TrendingUp, Package, ShieldAlert, ClipboardCheck, Truck, LayoutDashboard, Upload, Settings, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import heroDashboard from "@/assets/hero-dashboard.png";

const features = [
  { icon: ClipboardCheck, title: "Supplier Scorecards", desc: "Automated vendor evaluation reports with composite reliability scoring." },
  { icon: Truck, title: "Delivery Performance Analytics", desc: "Monitor on-time delivery trends across your entire supplier base." },
  { icon: Package, title: "Fill Rate Analysis", desc: "Track supplier fulfillment accuracy against ordered quantities." },
  { icon: ShieldAlert, title: "Quality Rejection Monitoring", desc: "Identify suppliers causing production defects and quality issues." },
  { icon: TrendingUp, title: "Procurement Risk Alerts", desc: "Detect supplier performance degradation before it impacts production." },
  { icon: BarChart3, title: "Composite Scoring", desc: "Weighted scoring combining delivery, fill rate, and quality metrics." },
];

const workflow = [
  { step: "01", title: "Upload Data", desc: "Import CSV or Excel procurement data — POs, GRNs, delivery records." },
  { step: "02", title: "Analyze", desc: "System calculates OTD, fill rate, rejection rate, and composite scores." },
  { step: "03", title: "Evaluate", desc: "Suppliers are graded A through D based on weighted performance metrics." },
  { step: "04", title: "Act", desc: "Receive actionable recommendations to optimize your supply chain." },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            <span className="font-sans font-bold text-lg text-foreground">SupplyLens</span>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/suppliers" className="flex items-center gap-2 cursor-pointer">
                  <Package className="h-4 w-4" /> Suppliers
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/upload" className="flex items-center gap-2 cursor-pointer">
                  <Upload className="h-4 w-4" /> Upload Data
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/metrics" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" /> Metrics
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-destructive">
                <LogOut className="h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="container py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl font-bold text-foreground leading-tight mb-4">
              SupplyLens
            </h1>
            <p className="text-lg font-sans font-medium text-primary mb-4">
              Supplier Performance Intelligence Platform
            </p>
            <p className="text-base text-muted-foreground mb-8 max-w-lg leading-relaxed">
              Transform procurement decisions with data-driven supplier analytics. Monitor supplier reliability, delivery performance, fill rates, and quality trends using procurement data.
            </p>
            <div className="flex gap-3">
              <Link
                to="/upload"
                className="inline-flex items-center justify-center h-10 px-5 bg-primary text-primary-foreground text-sm font-sans font-medium rounded hover:opacity-90 transition-opacity"
              >
                Upload Procurement Data
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center h-10 px-5 border border-border text-foreground text-sm font-sans font-medium rounded hover:bg-card transition-colors"
              >
                Explore Dashboard
              </Link>
            </div>
          </div>
          <div className="border border-border shadow-crisp rounded overflow-hidden">
            <img src={heroDashboard} alt="Analytics dashboard preview" className="w-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border">
        <div className="container py-20">
          <h2 className="text-2xl font-bold text-foreground mb-2">Key Features</h2>
          <p className="text-muted-foreground mb-12">Core capabilities powering your procurement intelligence.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {features.map((f) => (
              <div key={f.title} className="bg-background p-8">
                <f.icon className="w-5 h-5 text-primary mb-4" />
                <h3 className="font-sans font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="border-b border-border">
        <div className="container py-20">
          <h2 className="text-2xl font-bold text-foreground mb-2">Platform Workflow</h2>
          <p className="text-muted-foreground mb-12">From raw data to actionable procurement insights in four steps.</p>
          <div className="grid md:grid-cols-4 gap-8">
            {workflow.map((w) => (
              <div key={w.step} className="border border-border p-6 shadow-crisp">
                <span className="font-mono text-3xl font-bold text-primary mb-3 block">{w.step}</span>
                <h3 className="font-sans font-semibold text-foreground mb-2">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring */}
      <section className="border-b border-border">
        <div className="container py-20">
          <h2 className="text-2xl font-bold text-foreground mb-2">Supplier Scoring</h2>
          <p className="text-muted-foreground mb-12">Composite score formula and grade thresholds.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="border border-border p-8 shadow-crisp">
              <h3 className="font-sans font-semibold text-foreground mb-4">Composite Score Formula</h3>
              <div className="font-mono text-sm space-y-2 text-muted-foreground">
                <p>Score = 0.40 × On-Time Delivery</p>
                <p className="pl-12">+ 0.30 × Fill Rate</p>
                <p className="pl-12">+ 0.30 × Quality Performance</p>
              </div>
            </div>
            <div className="border border-border p-8 shadow-crisp">
              <h3 className="font-sans font-semibold text-foreground mb-4">Grade Tiers</h3>
              <div className="space-y-3">
                {[
                  { grade: 'A', range: '95–100', label: 'Strategic Partner', color: 'bg-success' },
                  { grade: 'B', range: '85–94', label: 'Reliable', color: 'bg-primary' },
                  { grade: 'C', range: '70–84', label: 'Needs Intervention', color: 'bg-warning' },
                  { grade: 'D', range: '< 70', label: 'Critical Risk / Replace', color: 'bg-destructive' },
                ].map((g) => (
                  <div key={g.grade} className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded flex items-center justify-center text-xs font-mono font-bold text-primary-foreground ${g.color}`}>{g.grade}</span>
                    <span className="font-mono text-sm text-foreground">{g.range}</span>
                    <span className="text-sm text-muted-foreground">({g.label})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container py-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span className="font-sans">SupplyLens</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">Supplier Performance Intelligence</p>
        </div>
      </footer>
    </div>
  );
}
