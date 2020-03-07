import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ExerciseService } from "../exercise.service";
import { Exercise } from "../exercise.model";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"]
})
export class NewTrainingComponent implements OnInit {
  @Output() trainingStart = new EventEmitter<void>();
  selectedId: string;
  exercises: Observable<Exercise[]>;

  constructor(
    private exerciseService: ExerciseService,
    private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.exercises = this.db
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
      );
    // .subscribe(result => {
    //   console.log(result);
    // });
    // this.exercises = this.exerciseService.getExercises();
  }
  onStartTraining(form: NgForm) {
    this.exerciseService.startExercise(form.value.exercise);
  }
}
