import FilterForm from "@/components/FilterForm";
import Chat from "@/components/Chat";
export default function Landing() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="lg:col-span-2"><FilterForm /></div>
      <div className="lg:col-span-3"><Chat /></div>
    </div>
  );
}
