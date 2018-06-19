import { Shop } from "./Shop";
import { Item } from "./Item";

export const Shops = [
    new Shop("Title Shop", "DotmaCoin", true, "Buy titles for your profile."),
    new Shop("Brad Shop", "BradCoin", false, "Some fat kid sells stuff here.")
];

Shops[0].addItems([
    new Item("The Knight", 150),
    new Item("The Baron", 150),
    new Item("The Egg", 300),
    new Item("The Dum kid", 300),
    new Item("The Apple Employee", 500),
    new Item("The Maccas Employee", 500),
    new Item("The QUT kid", 700),
    new Item("The UQ kid", 1000),
    new Item("The King", 1500),
    new Item("The Boss", 1500),
    new Item("The Fat kid", 5, "BradCoin"),
    new Item("The Brad", 5, "BradCoin"),
    new Item("YOUR CUSTOM TITLE", 50, "BradCoin")
]);
