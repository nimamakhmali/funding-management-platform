type AuthCardProps = {
  children: React.ReactNode;
};

export default function AuthCard({
  children,
}: AuthCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary-light to-indigo-500" />

      <div className="px-6 py-8 sm:px-10">
        {children}
      </div>
    </div>
  );
}