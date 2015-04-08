# Lesson 1: gentle introduction

<h2 id="1.1">Example 1.1: hello cycle</h2>

1. Everything is `Rx.Observable` (nearly)

2. Observables can be classified by their role

3. Common roles are:
   `Model / View / Interactions / Intent` (MVII)

4. Dependencies are circular:
   `Interactions <- Intent <- Model <- View <- Interactions`

5. This can be solved by making some part(s) of the system passive and anaware of others.

6. But CyleJS does not pretend to "simplify" reality.
   Instead it provides `Stream` abstraction and `inject` method to solve this in rather elegant way.

7. One `Stream` is enough to cut the dependency lock.


<h2 id="1.2">Example 1.2: hello streams</h2>

1. Every `Stream` provides injection point

2. Hardwired `Observable` is not testable (input/output is fixed!), but `Stream` is.

3. It's up to you how many streams you want to distinguish, just don't be afraid of a few more characters:
   they will pay back.

4. The point where everything injects provides bird-view of your app or component for free.


<h2 id="1.3">Example 1.3: hello nodes</h2>

1. MVII is a convenient preset, not a requirement (CycleJS is more a library, than a framework)

2. You business case may require more or less "classifiers". And it's completely idiomatic to add or remove them.

3. Every "group" may be viewed as logic point and is commonly called "node" in reactive programming.

4. Nodes with input and output describe logic flow. They are called data-flow nodes.

5. Nodes without output are called data-output or data-sink nodes.
   They describe side-effects of your app like storing data.

6. Nodes without input are called data-output or data-source nodes.
   They conversely describe side-effects of app environment.