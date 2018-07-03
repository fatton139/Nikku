import { Shop } from "./Shop";
import { Title } from "./Title";

export const Shops = [
    new Shop("Title Shop", "DotmaCoin", true, "Buy titles for your profile."),
    new Shop("Brad Shop", "BradCoin", false, "Some fat kid sells stuff here.")
];

Shops[0].addItems([
    new Title("The Knight", 1500),
    new Title("The Baron", 1500),
    new Title("The Egg", 3000),
    new Title("The Dum kid", 3000),
    new Title("The Apple Employee", 5000),
    new Title("The Maccas Employee", 5000),
    new Title("The QUT kid", 7000),
    new Title("The UQ kid", 10000),
    new Title("The King", 15000),
    new Title("The Boss", 15000),
    new Title("The Chad", 15000)
]);

Shops[1].addItems([
    new Title("The Fat kid", 5, "BradCoin"),
    new Title("The Brad", 5, "BradCoin"),
    new Title("YOUR CUSTOM TITLE", 50, "BradCoin")
]);
