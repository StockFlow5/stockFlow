"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";

export type ActivityType =
  | "mint"
  | "borrow"
  | "stake"
  | "vault"
  | "lock"
  | "unlock"
  | "psm"
  | "redeem";

export interface ActivityItem {
  type: ActivityType;
  amount: string;
  receive: string;
  timestamp: number;
}

interface SimulationState {
  susdBalance: number;
  usdcBalance: number;
  collateral: number;
  debt: number;
  ssusdStaked: number;
  sfBalance: number;
  sfLocked: number;
  activities: ActivityItem[];
  totalPosition: number;
  mint: (amount: number) => void;
  borrow: (amount: number, collateralValue: number) => void;
  stake: (amount: number) => void;
  vault: (amount: number) => void;
  lockSF: (amount: number) => void;
  unlockSF: (amount: number) => void;
  psmMint: (amount: number) => void;
  psmRedeem: (amount: number) => void;
}

const SimulationContext = createContext<SimulationState | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [susdBalance, setSusdBalance] = useState(0);
  const [usdcBalance, setUsdcBalance] = useState(10000);
  const [collateral, setCollateral] = useState(0);
  const [debt, setDebt] = useState(0);
  const [ssusdStaked, setSsusdStaked] = useState(0);
  const [sfBalance, setSfBalance] = useState(10000);
  const [sfLocked, setSfLocked] = useState(0);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const addActivity = useCallback(
    (type: ActivityType, amount: number, receive: string) => {
      setActivities((prev) => [
        {
          type,
          amount: amount.toFixed(2),
          receive,
          timestamp: Date.now(),
        },
        ...prev,
      ]);
    },
    []
  );

  const totalPosition = useMemo(
    () => susdBalance + collateral + ssusdStaked,
    [susdBalance, collateral, ssusdStaked]
  );

  const mint = useCallback(
    (amount: number) => {
      setSusdBalance((prev) => prev + amount);
      addActivity("mint", amount, "sUSD");
    },
    [addActivity]
  );

  const borrow = useCallback(
    (amount: number, collateralValue: number) => {
      setSusdBalance((prev) => prev + amount);
      setCollateral((prev) => prev + collateralValue);
      setDebt((prev) => prev + amount);
      addActivity("borrow", amount, "sUSD");
    },
    [addActivity]
  );

  const stake = useCallback(
    (amount: number) => {
      if (amount > susdBalance) return;
      setSusdBalance((prev) => prev - amount);
      setSsusdStaked((prev) => prev + amount);
      addActivity("stake", amount, "ssUSD");
    },
    [addActivity, susdBalance]
  );

  const vault = useCallback(
    (amount: number) => {
      if (amount > susdBalance) return;
      setSusdBalance((prev) => prev - amount);
      setSsusdStaked((prev) => prev + amount);
      addActivity("vault", amount, "ssUSD vault share");
    },
    [addActivity, susdBalance]
  );

  const lockSF = useCallback(
    (amount: number) => {
      if (amount > sfBalance) return;
      setSfBalance((prev) => prev - amount);
      setSfLocked((prev) => prev + amount);
      addActivity("lock", amount, "gSF");
    },
    [addActivity, sfBalance]
  );

  const unlockSF = useCallback(
    (amount: number) => {
      if (amount > sfLocked) return;
      setSfLocked((prev) => prev - amount);
      setSfBalance((prev) => prev + amount);
      addActivity("unlock", amount, "SF");
    },
    [addActivity, sfLocked]
  );

  const psmMint = useCallback(
    (amount: number) => {
      if (amount > usdcBalance) return;
      setUsdcBalance((prev) => prev - amount);
      setSusdBalance((prev) => prev + amount);
      addActivity("psm", amount, "sUSD");
    },
    [addActivity, usdcBalance]
  );

  const psmRedeem = useCallback(
    (amount: number) => {
      if (amount > susdBalance) return;
      setSusdBalance((prev) => prev - amount);
      setUsdcBalance((prev) => prev + amount);
      addActivity("redeem", amount, "USDC");
    },
    [addActivity, susdBalance]
  );

  const value = useMemo(
    () => ({
      susdBalance,
      usdcBalance,
      collateral,
      debt,
      ssusdStaked,
      sfBalance,
      sfLocked,
      activities,
      totalPosition,
      mint,
      borrow,
      stake,
      vault,
      lockSF,
      unlockSF,
      psmMint,
      psmRedeem,
    }),
    [
      susdBalance,
      usdcBalance,
      collateral,
      debt,
      ssusdStaked,
      sfBalance,
      sfLocked,
      activities,
      totalPosition,
      mint,
      borrow,
      stake,
      vault,
      lockSF,
      unlockSF,
      psmMint,
      psmRedeem,
    ]
  );

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) {
    throw new Error(
      "useSimulation must be used within SimulationProvider"
    );
  }
  return ctx;
}
