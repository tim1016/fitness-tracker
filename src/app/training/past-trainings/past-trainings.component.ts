import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Exercise } from "../exercise.model";
import { ExerciseService } from "../exercise.service";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-past-trainings",
  templateUrl: "./past-trainings.component.html",
  styleUrls: ["./past-trainings.component.css"]
})
export class PastTrainingsComponent implements OnInit, AfterViewInit {
  displayedColumns = ["date", "name", "duration", "calories", "state"];
  dataSource = new MatTableDataSource<Exercise>();
  constructor(private trainingService: ExerciseService) {}
  @ViewChild(MatSort) sort: MatSort;
  ngOnInit(): void {
    this.dataSource.data = this.trainingService.getAllExercises();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
