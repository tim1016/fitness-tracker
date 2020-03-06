import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { StopTrainingComponent } from "./stop-training.component";
import { ExerciseService } from "../exercise.service";
import { Subscription } from "rxjs";
import { Exercise } from "../exercise.model";

@Component({
  selector: "app-current-training",
  templateUrl: "./current-training.component.html",
  styleUrls: ["./current-training.component.css"]
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  @Output() trainingExit = new EventEmitter();
  progress = 0;
  timer: NodeJS.Timeout;
  trainingSubscription: Subscription;
  activeTraining: Exercise;

  constructor(
    private dialog: MatDialog,
    private trainingService: ExerciseService
  ) {}

  ngOnInit(): void {
    this.startAndResumeTimer();
    // this.trainingSubscription = this.trainingService.exerciseChanged.subscribe(
    //   result => {
    //     this.activeTraining = result;
    //   }
    // );
  }

  startAndResumeTimer() {
    this.activeTraining = this.trainingService.getCurrentExercise();
    const step = (this.activeTraining.duration * 1000) / 100;
    this.timer = setInterval(() => {
      this.progress += 1;
      if (this.progress >= 100) {
        this.trainingService.completeExercise();
        clearInterval(this.timer);
      }
    }, step);
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startAndResumeTimer();
      }
    });
  }

  ngOnDestroy() {
    if (this.trainingSubscription) this.trainingSubscription.unsubscribe;
  }
}
