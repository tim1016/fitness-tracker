import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy
} from "@angular/core";
import { ExerciseService } from "../exercise.service";
import { Exercise } from "../exercise.model";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"]
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  @Output() trainingStart = new EventEmitter<void>();
  selectedId: string;
  exercises: Exercise[];
  exercisesChangedSubscription: Subscription;

  constructor(private trainingService: ExerciseService) {}

  ngOnInit(): void {
    this.trainingService.fetchAvailableExercises();
    this.trainingService.exercisesChanged.subscribe(exercises => {
      this.exercises = exercises;
    });
  }
  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exercisesChangedSubscription)
      this.exercisesChangedSubscription.unsubscribe();
  }
}
