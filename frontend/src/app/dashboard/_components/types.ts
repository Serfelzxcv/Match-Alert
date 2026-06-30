export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  role: string;
  provider?: string | null;
}

export interface ApiFootballTeam {
  id: number;
  name: string;
  logo?: string;
  winner?: boolean | null;
}

export interface ApiFootballScorePair {
  home: number | null;
  away: number | null;
}

export interface ApiFootballEvent {
  time: {
    elapsed: number;
    extra?: number | null;
  };
  team: ApiFootballTeam;
  player: {
    id?: number | null;
    name?: string | null;
  };
  assist: {
    id?: number | null;
    name?: string | null;
  };
  type: string;
  detail: string;
  comments?: string | null;
}

export interface ApiFootballLiveFixture {
  fixture: {
    id: number;
    referee?: string | null;
    timezone?: string;
    date?: string;
    timestamp?: number;
    periods?: {
      first?: number | null;
      second?: number | null;
    };
    venue?: {
      id?: number | null;
      name?: string | null;
      city?: string | null;
    };
    status: {
      elapsed?: number | null;
      long?: string;
      short?: string;
      extra?: number | null;
    };
  };
  league: {
    id?: number;
    name: string;
    country: string;
    logo?: string;
    flag?: string;
    season?: number;
    round?: string;
    standings?: boolean;
  };
  teams: {
    home: ApiFootballTeam;
    away: ApiFootballTeam;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score?: {
    halftime?: ApiFootballScorePair;
    fulltime?: ApiFootballScorePair;
    extratime?: ApiFootballScorePair;
    penalty?: ApiFootballScorePair;
  };
  events?: ApiFootballEvent[];
}

export interface LiveFixturesResponse {
  response: ApiFootballLiveFixture[];
}

export type DashboardView =
  | 'home'
  | 'search'
  | 'live'
  | 'today'
  | 'news'
  | 'betting-highlights'
  | 'pre-match-alerts'
  | 'live-alerts';
