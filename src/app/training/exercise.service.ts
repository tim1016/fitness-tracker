import { Injectable, EventEmitter } from "@angular/core";
import { Exercise } from "./exercise.model";
import { Subject } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class ExerciseService {
  private availableExercises: Exercise[] = [
    { id: "crunches", name: "Crunches", duration: 15, calories: 8 },
    { id: "touch-toes", name: "Touch Toes", duration: 180, calories: 15 },
    { id: "side-lunges", name: "Side Lunges", duration: 120, calories: 18 },
    { id: "burpees", name: "Burpees", duration: 60, calories: 8 }
  ];
  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  private exercises: Exercise[] = [];

  constructor() {}

  getExercises(): Exercise[] {
    return this.availableExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      exercise => exercise.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: "completed"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(this.runningExercise);
  }
  cancelExercise(progress) {
    this.exercises.push({
      ...this.runningExercise,
      duration: (this.runningExercise.duration * progress) / 100,
      calories: (this.runningExercise.calories * progress) / 100,
      date: new Date(),
      state: "cancelled"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(this.runningExercise);
  }

  getCurrentExercise() {
    return { ...this.runningExercise };
  }
}
