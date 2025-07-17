import OrganizationalChart from '../components/OrganizationalChart';

const Index = () => {
  return (
    <div className="w-full h-screen bg-background">
      <div className="absolute top-4 left-4 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg">
        <h1 className="text-xl font-bold text-foreground mb-2">Organization Chart</h1>
        <p className="text-sm text-muted-foreground">Interactive organizational structure - drag to explore!</p>
      </div>
      <OrganizationalChart />
    </div>
  );
};

export default Index;
