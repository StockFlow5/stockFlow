"use client";

import { Activity, Landmark, PiggyBank, TrendingUp } from "lucide-react";

type ActivityType = "mint" | "borrow" | "stake";

export interface ActivityItem {
  type: ActivityType;
  amount: string;
  receive: string;
  timestamp: number;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const icons = {
  mint: Landmark,
  borrow: TrendingUp,
  stake: PiggyBank,
};

const labels: Record<ActivityType, string> = {
  mint: "Minted sUSD",
  borrow: "Borrowed sUSD",
  stake: "Staked sUSD",
};

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          Recent activity
        </h3>
      </div>
      <div className="mt-4 space-y-3">
        {activities.slice(0, 5).map((a, i) => {
          const Icon = icons[a.type];
          return (
            <div
              key={`${a.timestamp}-${i}`}
              className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-3 py-2.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {labels[a.type]}
                  </p>
                  <p className="text-xs text-muted">
                    {new Date(a.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">
                  {a.amount}
                </p>
                <p className="text-[10px] text-muted">{a.receive}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
