import {
    Briefcase,
    List,
    Code,
    Calendar,
    MapPin,
    Star,
    Globe,
    FileText,
  } from "lucide-react";

  export const STEP_ICONS: Record<string, JSX.Element> = {
    job_title: <Briefcase className="w-5 h-5" />,
    alternate_titles: <List className="w-5 h-5" />,
    tech_skills: <Code className="w-5 h-5" />,
    years_of_experience: <Calendar className="w-5 h-5" />,
    location: <MapPin className="w-5 h-5" />,
    skill_level: <Star className="w-5 h-5" />,
    remote_preference: <Globe className="w-5 h-5" />,
    resume_data: <FileText className="w-5 h-5" />,
  };