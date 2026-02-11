import { createServerClient } from "./lib/supabaseServer";
import SummaryCards from "./components/SummaryCards";
import LoanTable from "./components/LoanListTable";
import ActionBar from "./components/ActionBar";
import DashboardLayout from "./components/DashboardLayout";

export default async function Page() {
  const supabase = createServerClient();

  const { data: loans } = await supabase
    .from("loans")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <DashboardLayout>
      <SummaryCards loans={loans || []} />
      <ActionBar />
      <LoanTable loans={loans || []} />
    </DashboardLayout>
  );
}
