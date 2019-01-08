export class Skill {

    private name: string;

    private exp: number;

    private level: number;

    constructor(name: string) {
        this.name = name;
        this.exp = 0;
        this.level = 1;
    }

    public getExperienceAtLevel(level: number): number {
        let total = 0;
        for (let i = 1; i < level; i++) {
            total += Math.floor(i + 300 * Math.pow(2, i / 7.0));
        }

        return Math.floor(total / 4);
    }

    public getLevelAtExperience(experience: number): number {
        let index = 0;

        for (index = 0; index < 120; index++) {
            if (this.getExperienceAtLevel(index + 1) > experience) {
                break;
            }
        }
        // returns an int 4head
        return index;
    }
}
