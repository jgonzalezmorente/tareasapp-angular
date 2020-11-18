import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})
export class MyTasksComponent implements OnInit {

  constructor( private tasksService: TasksService ) { }

  ngOnInit(): void {

    this.tasksService.getTasks()
      .subscribe( resp => console.log(resp));
  }

}
