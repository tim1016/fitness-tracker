import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

import { Subject } from "rxjs";
import { map } from "rxjs/operators";

import { Exercise } from "./exercise.model";
import { MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY } from "@angular/material/dialog";

@Injectable({
  providedIn: "root"
})
export class ExerciseService {
  availableExercises: Exercise[];
  private runningExercise: Exercise;
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  private exercises: Exercise[] = [];
  private finishedExercises: Exercise[] = [];
  finishedExercisesChanged = new Subject<Exercise[]>();

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises(): void {
    // console.log("Hello");
    this.db
      .collection("availableExercises")
      .snapshotChanges()
      .pipe(
        map(docArray =>
          docArray.map(
            doc =>
              ({
                id: doc.payload.doc.id,
                ...(doc.payload.doc.data() as object)
              } as Exercise)
          )
        )
      )
      .subscribe(exercises => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  fetchFinishedExercises() {
    this.db
      .collection("finishedExercises")
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercises = exercises;
        this.finishedExercisesChanged.next(exercises);
      });
  }

  addToDatabase(exercise: Exercise) {
    this.db.collection("finishedExercises").add(exercise);
  }

  startExercise(selectedId: string) {
    this.db
      .doc("availableExercises/" + selectedId)
      .update({ lastSelected: new Date() });
    this.runningExercise = this.availableExercises.find(
      exercise => exercise.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: "completed"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(this.runningExercise);
    this.finishedExercisesChanged.next(this.finishedExercises);
  }
  cancelExercise(progress) {
    this.addToDatabase({
      ...this.runningExercise,
      duration: (this.runningExercise.duration * progress) / 100,
      calories: (this.runningExercise.calories * progress) / 100,
      date: new Date(),
      state: "cancelled"
    });
    this.runningExercise = null;
    this.exerciseChanged.next(this.runningExercise);
    this.finishedExercisesChanged.next(this.finishedExercises);
  }

  getCurrentExercise() {
    return { ...this.runningExercise };
  }

  getAllExercises() {
    return this.exercises.slice();
  }
}
