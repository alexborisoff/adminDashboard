import type { User } from '../features/users/usersSlice';

export interface AgeGroup {
   range: string;
   count: number;
   percentage: number;
}

export interface TimePeriod {
   period: string;
   count: number;
   date: Date;
}

export interface OverviewStats {
   totalUsers: number;
   averageAge: number;
   minAge: number;
   maxAge: number;
   oldestUser: User | null;
   youngestUser: User | null;
}

export const AGE_GROUPS = [
   { range: '0-18', min: 0, max: 18 },
   { range: '19-30', min: 19, max: 30 },
   { range: '31-45', min: 31, max: 45 },
   { range: '46-60', min: 46, max: 60 },
   { range: '60+', min: 61, max: Infinity },
] as const;

const MONTH_MAP: Record<string, number> = {
   Jan: 0,
   Feb: 1,
   Mar: 2,
   Apr: 3,
   May: 4,
   Jun: 5,
   Jul: 6,
   Aug: 7,
   Sep: 8,
   Oct: 9,
   Nov: 10,
   Dec: 11,
};

export const calculateOverviewStats = (users: User[]): OverviewStats => {
   if (users.length === 0) {
      return {
         totalUsers: 0,
         averageAge: 0,
         minAge: 0,
         maxAge: 0,
         oldestUser: null,
         youngestUser: null,
      };
   }

   const ages = users.map(user => user.age);
   const averageAge = Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length);
   const minAge = Math.min(...ages);
   const maxAge = Math.max(...ages);
   const oldestUser = users.find(user => user.age === maxAge) || null;
   const youngestUser = users.find(user => user.age === minAge) || null;

   return {
      totalUsers: users.length,
      averageAge,
      minAge,
      maxAge,
      oldestUser,
      youngestUser,
   };
};

export const calculateAgeDistribution = (users: User[]): AgeGroup[] => {
   if (users.length === 0) return [];

   const groups: AgeGroup[] = AGE_GROUPS.map(group => ({
      range: group.range,
      count: 0,
      percentage: 0,
   }));

   users.forEach(user => {
      for (let i = 0; i < AGE_GROUPS.length; i++) {
         if (user.age >= AGE_GROUPS[i].min && user.age <= AGE_GROUPS[i].max) {
            groups[i].count++;
            break;
         }
      }
   });

   groups.forEach(group => {
      group.percentage = Math.round((group.count / users.length) * 100);
   });

   return groups.filter(group => group.count > 0);
};

export const calculateRegistrationTimeline = (users: User[]): TimePeriod[] => {
   if (users.length === 0) return [];

   const periodMap = new Map<string, number>();

   users.forEach(user => {
      const date = new Date(user.createdAt);
      const monthKey = `${date.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
      periodMap.set(monthKey, (periodMap.get(monthKey) || 0) + 1);
   });

   const timeline: TimePeriod[] = Array.from(periodMap.entries())
      .map(([period, count]) => {
         const parts = period.split(' ');
         const date = new Date(parseInt(parts[1]), MONTH_MAP[parts[0]] || 0);
         return {
            period,
            count,
            date,
         };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-6);

   return timeline;
};

export const calculateActiveDays = (users: User[]): number => {
   return new Set(users.map(u => new Date(u.createdAt).toLocaleDateString())).size;
};
