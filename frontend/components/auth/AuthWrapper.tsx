type AuthWrapperProps = {
  children: React.ReactNode;
};

export default function AuthWrapper({ children }: AuthWrapperProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        {children}
      </div>
    </div>
  );
}
