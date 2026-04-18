import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { GroupDistribution } from '@/types/audit';

const CHART_COLORS = ['hsl(230,80%,56%)', 'hsl(160,60%,45%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)', 'hsl(270,60%,55%)', 'hsl(190,70%,50%)'];

interface GroupDrillDownProps {
  groupDistributions: Record<string, GroupDistribution[]>;
  protectedAttributes: string[];
}

export function GroupDrillDown({ groupDistributions, protectedAttributes }: GroupDrillDownProps) {
  const [openAttrs, setOpenAttrs] = useState<Record<string, boolean>>(
    () => Object.fromEntries(protectedAttributes.map((a, i) => [a, i === 0]))
  );

  return (
    <section className="space-y-4">
      <h2 className="font-heading text-xl font-semibold">Group Analysis by Attribute</h2>
      {protectedAttributes.map((attr) => {
        const data = groupDistributions[attr] || [];
        const pieData = data.map((g) => ({ name: g.group, value: g.count }));
        const barData = data.map((g) => ({ name: g.group, rate: +(g.positiveRate * 100).toFixed(1) }));

        return (
          <Collapsible
            key={attr}
            open={openAttrs[attr]}
            onOpenChange={(open) => setOpenAttrs((s) => ({ ...s, [attr]: open }))}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-4 border rounded-xl bg-card hover:bg-muted/50 transition-colors">
              <span className="font-heading font-semibold">{attr}</span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{data.length} groups</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${openAttrs[attr] ? 'rotate-180' : ''}`} />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Group Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}>
                            {pieData.map((_, i) => (
                              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Positive Outcome Rate by Group (%)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barData}>
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="rate" fill="hsl(230,80%,56%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Group details table */}
              <div className="mt-4 border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium">Group</th>
                      <th className="text-right px-4 py-2 font-medium">Count</th>
                      <th className="text-right px-4 py-2 font-medium">% of Total</th>
                      <th className="text-right px-4 py-2 font-medium">Positive Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((g) => (
                      <tr key={g.group} className="border-t">
                        <td className="px-4 py-2 font-medium">{g.group}</td>
                        <td className="px-4 py-2 text-right">{g.count}</td>
                        <td className="px-4 py-2 text-right">{g.percentage.toFixed(1)}%</td>
                        <td className="px-4 py-2 text-right font-mono">{(g.positiveRate * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </section>
  );
}
