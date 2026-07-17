export interface DialogueLine {
  sender: string;
  text: string;
  timestamp?: string;
}

export interface SimulationResult {
  eraOverview: string;
  targetBio: string;
  dialogue: DialogueLine[];
  futurePredictions: string[];
}

export interface TravelerProfile {
  name: string;
  fatherName: string;
  dob: string;
  place: string;
  mobileNumber: string;
  photoUrl: string;
  year: number;
}

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  type: "past" | "future";
}
