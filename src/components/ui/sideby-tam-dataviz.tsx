"use client";

import React, { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  FunnelChart,
  Funnel,
  LabelList,
  Sankey,
  Cell,
} from "recharts";
import { Users, School, Network, Map, ChevronRight } from "lucide-react";

type Tone = "blue" | "orange" | "pink" | "brown";

type StatCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: Tone;
};

function fmtMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtShort(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return fmtMoney(n);
}

function StatCard({ title, value, subtitle, icon: Icon, tone = "blue" }: StatCardProps) {
  const tones: Record<Tone, string> = {
    blue: "bg-[#1A40F4] text-[#FBF6E3]",
    orange: "bg-[#F67201] text-[#FBF6E3]",
    pink: "bg-[#F99EB3] text-[#401612]",
    brown: "bg-[#401612] text-[#FBF6E3]",
  };

  return (
    <Card className="overflow-hidden rounded-[28px] border-0 bg-[#FBF6E3] shadow-[0_8px_30px_rgba(64,22,18,0.10)]">
      <CardContent className="p-0">
        <div className={`flex items-center justify-between p-4 ${tones[tone]}`}>
          <span className="text-sm font-semibold uppercase tracking-wide">{title}</span>
          <Icon className="h-5 w-5" />
        </div>
        <div className="p-5">
          <div className="text-4xl font-black leading-none text-[#401612] md:text-5xl" style={{ fontFamily: '"Cabin Condensed", sans-serif' }}>
            {value}
          </div>
          <div className="mt-2 text-sm text-[#401612]/70" style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}>
            {subtitle}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SidebyTamDataviz() {
  const [monthlyPrice, setMonthlyPrice] = useState<number>(20);
  const [teachersPerPrincipal, setTeachersPerPrincipal] = useState<number>(30);
  const [consortiumStates, setConsortiumStates] = useState<number>(12);

  const assumptions = useMemo(() => {
    const annualPrice = monthlyPrice * 12;
    const principalsWA = 3800;
    const teachersWA = principalsWA * teachersPerPrincipal;
    const principalsUS = 90000;
    const teachersUS = 3_500_000;

    const waPrincipalRevenue = principalsWA * annualPrice;
    const waTeacherRevenue = teachersWA * annualPrice;
    const waCombinedRevenue = waPrincipalRevenue + waTeacherRevenue;
    const consortiumRevenue = waCombinedRevenue * consortiumStates;
    const usPrincipalRevenue = principalsUS * annualPrice;
    const usTeacherRevenue = teachersUS * annualPrice;
    const usCombinedRevenue = usPrincipalRevenue + usTeacherRevenue;

    return {
      annualPrice,
      principalsWA,
      teachersWA,
      waPrincipalRevenue,
      waTeacherRevenue,
      waCombinedRevenue,
      consortiumRevenue,
      usCombinedRevenue,
    };
  }, [monthlyPrice, teachersPerPrincipal, consortiumStates]);

  const marketBars = [
    { name: "WA principals", value: assumptions.waPrincipalRevenue, fill: "#1A40F4" },
    { name: "WA teachers", value: assumptions.waTeacherRevenue, fill: "#F67201" },
    { name: `${consortiumStates}-state model`, value: assumptions.consortiumRevenue, fill: "#BF0059" },
    { name: "U.S. market", value: assumptions.usCombinedRevenue, fill: "#37D37B" },
  ];

  const funnelData = [
    { value: assumptions.waPrincipalRevenue, name: "Beachhead: WA principals" },
    { value: assumptions.waCombinedRevenue, name: "Land + expand: WA schools" },
    { value: assumptions.consortiumRevenue, name: `${consortiumStates}-state consortium` },
    { value: assumptions.usCombinedRevenue, name: "National opportunity" },
  ];

  const sankeyData = {
    nodes: [
      { name: "WA principals" },
      { name: "Teachers in WA" },
      { name: "WA TAM" },
      { name: `${consortiumStates}-state network" },
      { name: "National TAM" },
    ],
    links: [
      { source: 0, target: 2, value: Math.max(assumptions.waPrincipalRevenue, 1) },
      { source: 1, target: 2, value: Math.max(assumptions.waTeacherRevenue, 1) },
      { source: 2, target: 3, value: Math.max(assumptions.consortiumRevenue, 1) },
      { source: 3, target: 4, value: Math.max(assumptions.usCombinedRevenue, 1) },
    ],
  };

  const pdComparison = [
    { label: "Traditional PD (low)", amount: 100, fill: "#F99EB3" },
    { label: "sideby", amount: assumptions.annualPrice, fill: "#1A40F4" },
    { label: "Traditional PD (high)", amount: 500, fill: "#F67201" },
  ];

  return (
    <div className="min-h-screen bg-[#FBF6E3] text-[#401612]" style={{ fontFamily: '"Bricolage Grotesque", sans-serif' }}>
      <div className="mx-auto max-w-7xl p-6 md:p-10">
        <div className="relative overflow-hidden rounded-[36px] bg-[#1A40F4] p-8 text-[#FBF6E3] shadow-[0_12px_40px_rgba(26,64,244,0.25)] md:p-12">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(251,246,227,0.35) 1px, transparent 1px)", backgroundSize: "100% 28px" }} />
          <div className="relative grid items-end gap-8 md:grid-cols-[1.3fr_0.7fr]">
            <div>
              <Badge className="mb-4 rounded-full bg-[#F99EB3] px-4 py-1 text-sm text-[#401612] hover:bg-[#F99EB3]">
                TAM / SAM / SOM visualization
              </Badge>
              <h1 className="text-5xl font-bold leading-[0.9] md:text-7xl" style={{ fontFamily: '"Cabin Condensed", sans-serif' }}>
                sideby market map
              </h1>
              <p className="mt-4 max-w-2xl text-base text-[#FBF6E3]/90 md:text-lg">
                A branded view of how a principal-led wedge in Washington can expand into teachers, a multi-state consortium, and a national educator learning market. Each pathway includes context on relationship quality so a standalone viewer can understand why the progression is plausible, not just mathematically large.
              </p>
            </div>

            <Card className="rounded-[28px] border-0 bg-[#FBF6E3] text-[#401612] shadow-none">
              <CardContent className="p-6">
                <div className="text-sm uppercase tracking-wide text-[#401612]/60">Current annual price</div>
                <div className="mt-1 text-5xl font-bold" style={{ fontFamily: '"Cabin Condensed", sans-serif' }}>{fmtMoney(assumptions.annualPrice)}</div>
                <div className="mt-4 flex items-center gap-2 text-sm text-[#401612]/70">
                  <ChevronRight className="h-4 w-4" />
                  {fmtMoney(monthlyPrice)}/month per educator
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="rounded-[28px] border-0 bg-white/60 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Monthly price</CardTitle>
              <CardDescription>Adjust the annual contract value assumption.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center justify-between text-sm">
                <span>$10</span>
                <span className="font-semibold">${monthlyPrice}/mo</span>
                <span>$40</span>
              </div>
              <Slider value={[monthlyPrice]} min={10} max={40} step={1} onValueChange={(values) => setMonthlyPrice(values[0] ?? 20)} />
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-0 bg-white/60 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Teachers per principal</CardTitle>
              <CardDescription>Model school-level expansion from leader to staff.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center justify-between text-sm">
                <span>10</span>
                <span className="font-semibold">{teachersPerPrincipal}</span>
                <span>50</span>
              </div>
              <Slider value={[teachersPerPrincipal]} min={10} max={50} step={1} onValueChange={(values) => setTeachersPerPrincipal(values[0] ?? 30)} />
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-0 bg-white/60 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>Consortium states</CardTitle>
              <CardDescription>Test the effect of the regional network thesis.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-3 flex items-center justify-between text-sm">
                <span>1</span>
                <span className="font-semibold">{consortiumStates} states</span>
                <span>20</span>
              </div>
              <Slider value={[consortiumStates]} min={1} max={20} step={1} onValueChange={(values) => setConsortiumStates(values[0] ?? 12)} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="WA principals" value={fmtShort(assumptions.waPrincipalRevenue)} subtitle={`${assumptions.principalsWA.toLocaleString()} principals at ${fmtMoney(assumptions.annualPrice)}/year`} icon={School} tone="blue" />
          <StatCard title="WA teachers" value={fmtShort(assumptions.waTeacherRevenue)} subtitle={`${assumptions.teachersWA.toLocaleString()} teachers via principal-led expansion`} icon={Users} tone="orange" />
          <StatCard title={`${consortiumStates}-state model`} value={fmtShort(assumptions.consortiumRevenue)} subtitle="Regional expansion through consortium distribution" icon={Map} tone="pink" />
          <StatCard title="U.S. TAM" value={fmtShort(assumptions.usCombinedRevenue)} subtitle="National educator and school leader opportunity" icon={Network} tone="brown" />
        </div>
      </div>
    </div>
  );
}
