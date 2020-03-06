import { Component, OnInit, OnDestroy } from "@angular/core";
import { ExerciseService } from "./exercise.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-training",
  templateUrl: "./training.component.html",
  styleUrls: ["./training.component.css"]
})
export class TrainingComponent implements OnInit, OnDestroy {
  onGoingTraining = false;
  exerciseStartSub: Subscription;
  constructor(private exerciseService: ExerciseService) {}

  ngOnInit(): void {
    this.exerciseStartSub = this.exerciseService.exerciseChanged.subscribe(
      result => {
        this.onGoingTraining = !!result;
      }
    );
  }

  ngOnDestroy() {
    if (this.exerciseStartSub) this.exerciseStartSub.unsubscribe();
  }
}
