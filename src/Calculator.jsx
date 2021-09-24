import React from "react";
import { pipe, Subject, merge } from "rxjs";
import { filter, map, scan, takeUntil, tap } from "rxjs/operators";
import Result from "./Result";
import NumPad from "./NumPad";
import MathOperationsPad from "./MathOperationsPad";
import "./styles.css";

export default class App extends React.Component {
  render() {
    return (
      <div className="main">
        <Result content={this.state.result} />
        <NumPad whenAction={this.onNumber} />
        <MathOperationsPad onAction={this.onMathOperation} />
        <div>{JSON.stringify(this.state.expr, null, 2)}</div>
      </div>
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
    this.numAction$ = new Subject();
    this.mathOperation$ = new Subject();
    this.mathExpression$ = this.streamMathExpression();
    this.result$ = this.streamResult();

    this.result$
      .pipe(
        tap((result) => this.setState((state) => ({ ...state, result }))),
        takeUntil(this.onUnmount$)
      )
      .subscribe();

    this.mathExpression$
      .pipe(
        tap((expr) => this.setState((state) => ({ ...state, expr }))),
        takeUntil(this.onUnmount$)
      )
      .subscribe();
  }

  componentWillUnmount() {
    this.onUnmount$.next();
    this.onUnmount$.complete();
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.userID !== prevProps.userID) {
      this.fetchData(this.props.userID);
    }
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

            if (action === "number" && operator === null) {
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
      tap((x) => console.log("*** result 2", x)),
      map(({ values }) => values[0]),
      map((result) => JSON.stringify(result))
    )(null);
  }
}