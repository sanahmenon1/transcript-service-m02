import { beforeEach, describe, expect, it } from 'vitest';
import { TranscriptDB, type TranscriptService } from './transcript.service.ts';

let db: TranscriptService;
beforeEach(() => {
  db = new TranscriptDB();
});

describe('addStudent', () => {
  it('should add a student to the database and return their id', () => {
    expect(db.nameToIDs('blair')).toStrictEqual([]);
    const id1 = db.addStudent('blair');
    expect(db.nameToIDs('blair')).toStrictEqual([id1]);
  });

  it('should return an ID distinct from any ID in the database', () => {
    // we'll add 3 students and check to see that their IDs are all different.
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('del');
    expect(id1).not.toEqual(id2);
    expect(id1).not.toEqual(id3);
    expect(id2).not.toEqual(id3);
  });

  it('should permit adding a student w/ same name as an existing student', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('blair');
    expect(id1).not.toEqual(id2);
  });
});

describe('getTranscript', () => {
  it('given the ID of a student, should return the student’s transcript', () => {
    const id1 = db.addStudent('blair');
    expect(db.getTranscript(id1)).not.toBeNull();
  });

  it('given the ID that is not the ID of any student, should throw an error', () => {
    // in an empty database, all IDs are bad :)
    // Note: the expression you expect to throw
    // must be wrapped in a (() => ...)
    expect(() => db.getTranscript(1)).toThrowError();
  });
});

describe('addGrade', () => {
  it('should allow the user can add a new grade for an existing student so it is shown on their transcript', () => {
    const id1 = db.addStudent('blair');
    db.addGrade(id1, 'CS4530', { course: 'CS4530', grade: 95 });
    expect(db.getTranscript(id1).grades).toStrictEqual([{ course: 'CS4530', grade: 95 }]);
  });

  it('should return the correct grade when getting a grade for a student after the addGrade is called', () => {
    const id1 = db.addStudent('blair');
    db.addGrade(id1, 'CS4530', { course: 'CS4530', grade: 95 });
    expect(db.getGrade(id1, 'CS4530')).toStrictEqual({ course: 'CS4530', grade: 95 });
  });

  it('should throw an error when adding a grade for an ID that does not exist', () => {
    expect(() => db.addGrade(999, 'CS4530', { course: 'CS4530', grade: 95 })).toThrowError();
  });

  it('should overwrite the existing grade when adding a grade for a course the student already has a grade for', () => {
    const id1 = db.addStudent('blair');
    db.addGrade(id1, 'CS4530', { course: 'CS4530', grade: 70 });
    db.addGrade(id1, 'CS4530', { course: 'CS4530', grade: 90 });
    expect(db.getGrade(id1, 'CS4530')).toStrictEqual({ course: 'CS4530', grade: 90 });
  });
});