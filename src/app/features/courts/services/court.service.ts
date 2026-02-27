import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Court, CreateCourtDto, UpdateCourtDto } from '../models/court.interface';
import { ApiResponse } from '../../../core/models/api-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CourtService {
  private readonly API_URL = `${environment.apiUrl}/courts`;

  constructor(private http: HttpClient) {}

  getCourts(): Observable<Court[]> {
    return this.http.get<ApiResponse<Court[]>>(this.API_URL)
      .pipe(map(response => response.data!));
  }

  getActiveCourts(): Observable<Court[]> {
    return this.http.get<ApiResponse<Court[]>>(`${this.API_URL}/active`)
      .pipe(map(response => response.data!));
  }

  getCourtById(id: string): Observable<Court> {
    return this.http.get<ApiResponse<Court>>(`${this.API_URL}/${id}`)
      .pipe(map(response => response.data!));
  }

  createCourt(court: CreateCourtDto): Observable<Court> {
    return this.http.post<ApiResponse<Court>>(this.API_URL, court)
      .pipe(map(response => response.data!));
  }

  updateCourt(id: string, court: UpdateCourtDto): Observable<Court> {
    return this.http.patch<ApiResponse<Court>>(`${this.API_URL}/${id}`, court)
      .pipe(map(response => response.data!));
  }

  deleteCourt(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`)
      .pipe(map(response => response.data!));
  }

  reorderCourts(courtIds: string[]): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/reorder`, { court_ids: courtIds })
      .pipe(map(response => response.data!));
  }
}
