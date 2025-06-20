import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function getDayName(dayIndex: number): string {
  const days = ['Diel', 'Hënë', 'Martë', 'Mërkurë', 'Enjte', 'Premte', 'Shtunë'];
  return days[dayIndex] || 'N/A';
}

export function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case "krahë":
      return "from-primary to-orange-400";
    case "këmbë":
      return "from-secondary to-blue-500";
    case "kardio":
      return "from-accent to-green-500";
    case "gjoks":
      return "from-purple-500 to-pink-500";
    case "shpinë":
      return "from-yellow-500 to-orange-500";
    case "bark":
      return "from-red-500 to-pink-500";
    default:
      return "from-gray-500 to-gray-600";
  }
}

export function getDifficultyColor(difficulty: string): string {
  switch (difficulty.toLowerCase()) {
    case "fillestare":
      return "bg-green-500";
    case "mesatare":
      return "bg-yellow-500";
    case "përparuar":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}
