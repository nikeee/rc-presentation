name: title
class: middle, center

# React Compiler
Purpose, Adoption, and Behind the Scenes
<br>
Niklas Mollenhauer
<br>
Slides: https://github.com/nikeee

???
- Fragen können gerne mittem im Vortrag gestellt werden
- Ich interessier mich für Compiler
  - Neulich: Kunde brauchte React und es gab Perf-Probleme
- **Umfrage**: Wer benutzt React?
- **Umfrage**: Wer hat schonmal useCallback/useMemo oder memo benutzt?
- Zu dem Thema kann man viel sagen, am Ende sind Links; wir haben nur 20min
- Slides gibts unter dem GitHub später

---
# Überblick
- Was macht performantes React schwierig?
- Wie hilft RC?
- Aktueller Fokus von RC
- Benutzen?
- Ausblick

???
- RC ist auch das neue Backend für den neuen Linter

---
# Was macht performantes React schwierig?
--

- React ist nicht bekannt für Performance
--

- Vieles
--

  - Bundle Size
--

  - Re-rendering bei Updates
--

  - ...

--

  - Viel manuelle Arbeit, da kein optimierender Compiler

???
- Wir haben heute auch einen Asto-Talk:
  - Da wird es sicherlich auch ein paar Beispiele geben
- Nichtsdestotrotz gibt es jetzt ne menge React und damit müssen wir dealen

---
name: title
class: middle, center

# Wie hilft RC?
## Demo

???
- Dependency-Array zeigen, mit Anmerkung an Compiler-in-mind
- useMemo
- useCallback mit dem setState
- const increment = 10;
- if increment === 20 /2

---
# Aktueller Fokus von RC
--

- Auto-Memoization ("automatisches" `useMemo`, `useCallback`)
--

- Constant Folding / -Propagation
--

- Dead Code Elimination
--

- Nicht komponentenübergreifend

???
- RC kennt "rules of react"
- CF hilft bei Vorberechnungen / Bundle Size
- Dead Code Elimination hilft bie der Bundle Size
- Bundler machen DCE auch, aber die verstehen React-Semantik nicht

---
# Benutzen?

- RC ist aktuell ein Release Candidate
--

- Meta benutzt ihn intern bei Facebook, Instagram, Quest Store etc. länger
--

- Funktioniert mit React 19, 18 und 17
  - < 19 braucht runtime-dependency

--
- Library-Autoren: _ihr_ müsst kompilieren und Kompilat publishen

--
- Optimierungen sind sehr vorsichtig

--
- Wer sicher gehen will: Komponentenweise vorgehen

???
- RC ist neu zwischen letzten und diesem Webmontag
- Vorsichtig:
  - Wenn er nicht beweisen kann, dass die Optimierung sicher ist, wird ganze Komponente übersprungen
  - Man kann ihn anschalten und sollte keine Bugs bekommen
    - Bei Kundenprojekt gemacht und gab kein Problem

---
# Ausblick
- eslint-plugin-react-hooks

--

- Linter-integration für rust-basierte linter (OXC/biomejs)


???
- Linter: RC ist in JS geschrieben
  - Haben mehrere Transformationen intern
  - Benutzt wer biomejs? -> das kann dauern
    - Recommendation: eslint mit dieser einen Regel benutzen oder den compiler-healthcheck

--

- React IDE / VSCode-Plugin / LSP

???
- IDE: Noch offen, was genau das wird
<!-- .footer[<sup>1</sup>: https://github.com/oxc-project/oxc/issues/10048] -->

---
# Aublick - useEffect
```js
function Component({ value }) {
	useEffect(() => {
		// ... value
	}, [value]);
}
```
--

```js
function Component({ value }) {
	useEffect(() => {
		// ... value
	}); // no dependency array
}
```

---
# The Future - Component Inlining

```jsx
function Foo() {
	return <Bar />;
}
function Bar() {
	return <Baz />;
}
function Baz() {
	return <span />;
}
```

--
->

```jsx
function Foo() { return <span />; }
// (Bar+Baz kept for dynamic use)
```

---
name: title
class: middle, center

Neugierig? Schneller überblick, wie kompatibel euer Projekt ist:
```sh
npx react-compiler-healthcheck
```

---
# Links
- React Compiler RC: https://react.dev/blog/2025/04/21/react-compiler-rc
- Beta Release: https://react.dev/blog/2024/10/21/react-compiler-beta-release
- What's next for RC? https://www.youtube.com/watch?v=qd5yk2gxbtg
- RC Deep Dive: https://www.youtube.com/watch?v=uA_PVyZP7AI
- ReactConf Talk: https://youtu.be/lyEKhv8-3n0?t=2670
- React Summit Q&A: https://youtu.be/C8Mg-NSyqWg?t=14151
- Rules of React: https://react.dev/reference/rules
- Playground: https://playground.react.dev
- Jack Herringtons Playground: https://github.com/jherr/compiler-repl
- https://dev.to/bhdrpkcn/react-performance-optimization-2hc1
- Installieren: https://react.dev/learn/react-compiler

???
<!-- https://www.youtube.com/watch?v=PYHBHK37xlE -->
<!-- https://www.npmjs.com/package/react-compiler-healthcheck -->

---

# Backup slides

---
# The Future - Component Outlining

```jsx
<>
	{list.map(e => <span key={e.id}>{e.name} ... </span>)}
<>
```
- Inner component gets moved into a separate component

---
# Aublick - JSX Inlining

```jsx
function Child({children}) {
    return <>{children}</>
}
```
--

Nach Bundling:
```js
import { Fragment, jsx } from "react/jsx-runtime";
function Child({ children }) {
    return jsx(Fragment, { children });
}
```
--

- Call to `jsx` with constant values
- `jsx` is pure -> call can be inlined

---
# The Future - JSX Inlining

```jsx
function Child({children}) {
    return <>{children}</>
}
```

After RC (but before bundling):
```js
function Child({children}) {
    return {
        $$typeof: Symbol.for("..."),
        type: Symbol.for("react.fragment"),
        ref: null,
        key: null,
        props: { children },
    };
}
```
