import AliasEntity from "./aliasEntity";
import InheritedEntity from "./inheritedEntity";
import ObjectEntity from "./objectEntity";
import UnionEntity from "./unionEntity";

type Entity = AliasEntity | ObjectEntity | InheritedEntity | UnionEntity;

export default Entity;
