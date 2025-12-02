import {Loader} from "lucide-react"
const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader size={64} color="#f5cefe" className="animate-spin" />
    </div>
  );
}

export default PageLoader