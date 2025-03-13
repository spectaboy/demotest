import { LucideCar } from "lucide-react"

const Car = ({ className, ...props }: { className?: string; [key: string]: any }) => (
  <LucideCar className={className} {...props} />
)

export default Car

