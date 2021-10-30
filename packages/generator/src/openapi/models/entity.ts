import type AliasEntity from "./aliasEntity";
import type InheritedEntity from "./inheritedEntity";
import type ObjectEntity from "./objectEntity";
import type UnionEntity from "./unionEntity";

type Entity = AliasEntity | ObjectEntity | InheritedEntity | UnionEntity;

export default Entity;
