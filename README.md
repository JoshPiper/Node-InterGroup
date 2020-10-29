## InterGroup

InterGroup is a simple package to map input values to output values,
initially designed for mapping mybb group ids to discord guild ids.

### Classes

#### AbstractGroupHandler

The abstract group handler only has internal handlers for mapping internal IDs to external IDs,
designed to be as abstract as possible.

#### addX

The addX methods are used to add mappings to the object, and come in multiple varients.

##### addMapping

addMapping takes a single ID, and either a single or array value, and maps one to the other, in a very simple form.
If the input groups contain the ID, add all the values to the output.

##### addPair

addPair takes two IDs, and either a single or array output value, and requires both be present to add to the output.

##### addUnpair

addUnpair takes two IDs, and requires the first and not having the second be present to add the outputs.

##### addManaged

addManaged takes a single output value, to add unmapped but managed IDs (such as for deprecated groups), which should be handled,
but don't have an active input to output mapping.

#### resolve

The resolve function takes a single input value, and maps it to the corresponding simple output value.
This however, doesn't handle pairs or removals, since it only takes a single input value.

#### resolveAll

The resolveAll function takes an array, returning all mapped values, along with any pair/unpair variants.

#### handleGroup

handleGroup is the most complex function, taking both an array of input groups, and an array of current output groups.
From this, it resolves the required output groups, using resolveAll, then returns an array of groups to add (which aren't currently on the user), and an array to remove.

### DiscordGroupHandler

The DiscordGroupHandler is much the same as the Abstract handler, yet has code specifically written to interface with
Discord.js, to handle discord role IDs as outputs, and setting roles on Guild Members.

#### resolveMember

resolveMember takes a GuildMember and an array of input values, and handles them with handleGroup, again return the add/remove arrays.

#### handleMember

handleMember uses resolveMember to add/remove the groups, bringing it into sync.
