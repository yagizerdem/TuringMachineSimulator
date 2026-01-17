import logo from "../assets/logo4.png";

export function DefaultLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-background text-foreground">
      <div className="w-full h-fit flex items-center justify-center p-4">
        <img src={logo} className="bg-foreground" />
      </div>
      <div className="w-full h-full flex flex-row  overflow-hidden">
        {children}
      </div>
    </div>
  );
}
