export default class Skill {

    // private skillType: SkillType;

    // private currentExperience: number;

    // private currentLevel: number;

    public constructor() {
        // this.skillType = type;
        // this.currentExperience = startingExperience;
        // this.currentLevel = startingLevel;
    }

    public static getExperienceAtLevel(level: number): number {
        let total = 0;
        for (let i = 1; i < level; i++) {
            total += Math.floor(i + 300 * Math.pow(2, i / 7.0));
        }
        return Math.floor(total / 4);
    }

    public static getLevelAtExperience(experience: number): number {
        let index = 0;
        for (index = 0; index < 120; index++) {
            if (this.getExperienceAtLevel(index + 1) > experience) {
                break;
            }
        }
        return index;
    }
}
