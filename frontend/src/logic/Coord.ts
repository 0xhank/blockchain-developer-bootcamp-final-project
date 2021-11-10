import react from 'react'

export default class Coord {
  public row : number;
  public col : number;

  constructor(row : number, col : number) {
    this.row = row;
    this.col = col;
  }

  public equals(obj : Coord) {
    return this.col == obj.col && this.row == obj.row;
  }

  public toString() {
    return "(" + this.row.toString() + "," + this.col.toString() + ")";
  }
}
