# **CSS Notes**



1. **Selectors:** The ability to select any element on a web page.



**2. DOM:** Document Object Model

kind of tree .. say div has childs h1, p, img etc



#### 3\. Type of Selectors:

i) universal selectors (h1 has its own style) \*{margin:0px}->removes all margins that were added by default

ii) Type selector : What type of element you are selecting on a webpage ex:p{}

iii) Class selectors: class like .{}

iv) ID Selector :id #{}

v) Attribute Selector: we can take particular attribute like input\[text]{}

vi)Descendant selector:

div p{} p which is a descendant of div...

say <article> <p> <p> then div<>p<>

the p inside div also gets effected

vii)Child selector: Only children ul > li {}

viii) Adjacent sibling +

ix) General sibling ~

x) Pseudo selector a:hover{}

xi) Pseudo element selector :

p::first-letter{ font-weight: bold}

xii) group selector : p,h1,h2{}



#### 4\. Box Model

* Border box : default of browsers and it adds padding + specified
* Content box: considers padding along with specified only



Inline vs Block :

Inline - takes space required by content

Block - takes entire space ....



5.In CSS, ::after creates a pseudo-element that is the last child of the selected element. It is often used to add cosmetic content to an element with the content property. It is inline by default.

