import React from "react";
import { pipe, Subject, merge } from "rxjs";
import { filter, map, scan, shareReplay, takeUntil, tap } from "rxjs/operators";
import styled from "@emotion/styled";
import Result from "./Result";
import NumPad from "./NumPad";
import MathOperationsPad from "./MathOperationsPad";
import "./styles.css";

const CaclulatorLayout = styled(
  ({ className, result, numPad, operationsPad }) => (
    <div className={className}>
      <div className="result">{result}</div>
      <div className="keysPads">
        {numPad} {operationsPad}
      </div>
    </div>
  )
)({
  display: "flex",
  flexFlow: "column",
  gap: "15px",
  alignItems: "stretch",
  ".result": {},
  ".keysPads": {
    display: "flex",
    gap: "15px"
  }
});

export default class Caclulator extends React.Component {
  render() {
    return (
      <CaclulatorLayout
        result={<Result content={this.state.result} />}
        numPad={<NumPad whenAction={this.onNumber} />}
        operationsPad={<MathOperationsPad onAction={this.onMathOperation} />}
      />
    );
  }

  constructor(props) {
    super(props);

    this.onNumber = (num) => this.numAction$.next(num);
    this.onMathOperation = (operation) => this.mathOperation$.next(operation);

    this.state = {
      result: "",
      expr: []
    };
  }

  componentDidMount() {
    this.onUnmount$ = new Subject();
    this.propsChanges$ = new Subject();
    this.numAction$ = new Subject();
    this.mathOperation$ = new Subject();
    this.inputMode$ = handlePropChange("mode", this.propsChanges$);
    this.mathExpression$ = this.streamMathExpression();
    this.result$ = this.streamResult();

    merge(
      this.inputMode$,
      this.result$.pipe(
        tap((result) => this.setState((state) => ({ ...state, result })))
      ),
      this.mathExpression$.pipe(
        tap((expr) => this.setState((state) => ({ ...state, expr })))
      )
    )
      .pipe(takeUntil(this.onUnmount$))
      .subscribe();
  }

  componentWillUnmount() {
    this.onUnmount$.next();
    this.onUnmount$.complete();
  }

  componentDidUpdate(prevProps) {
    this.propsChanges$.next({ prev: prevProps, current: this.props });
  }

  streamMathExpression() {
    return pipe(
      () =>
        merge(
          this.numAction$.pipe(
            map((num) => ({ action: "number", value: num }))
          ),
          this.mathOperation$.pipe(
            map((op) => ({ action: "operation", value: op }))
          )
        ),
      scan((expr, { action, value }) => {
        if (
          action === "number" &&
          expr.length > 0 &&
          expr[expr.length - 1].action === "number"
        ) {
          return expr;
        }

        if (
          action === "operation" &&
          (expr.length === 0 || expr[expr.length - 1].action === "operation")
        ) {
          return expr;
        }

        return [...expr, { action, value }];
      }, [])
    )(null);
  }

  streamResult() {
    return pipe(
      () => this.mathExpression$,
      filter((expr) => expr.length >= 3 && expr.length % 2 === 1),
      map((expr) =>
        expr.reduce(
          ({ values, operator }, { action, value }) => {
            if (action === "operation") {
              return { values, operator: value };
            }

            if (operator === null) {
              return { values: [...values, value], operator };
            }

            function op(action) {
              if (action === "+") return (a, b) => a + b;
              if (action === "-") return (a, b) => a - b;
              throw new Error("unimplemented");
            }

            const result = op(operator)(values[0], value);

            return { values: [result], operator: null };
          },
          { values: [], operator: null }
        )
      ),
      map(({ values }) => values[0]),
      map((result) => JSON.stringify(result))
    )(null);
  }
}

function handlePropChange(propName, propsChanges$) {
  return propsChanges$.pipe(
    filter(({ prev, current }) => prev[propName] !== current[propName]),
    map(({ current }) => current[propName]),
    shareReplay({ bufferSize: 1, refCount: true })
  );
}
