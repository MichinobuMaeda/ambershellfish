import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/account.dart';
import '../models/firestore_model.dart';

class FireStorereDeligate {
  final FirebaseFirestore _db;
  Account? _me;
  StreamSubscription? _sub;

  FireStorereDeligate(
    FirebaseFirestore db,
  ) : _db = db;

  FirebaseFirestore get db => _db;

  Account? get me => _me;

  Future<void> subscribe(Account me) async {
    _me = me;
  }

  Future<void> unsubscribe() async {
    _me = null;
  }

  Future<void> listen(StreamSubscription sub) async {
    await cancel();
    _sub = sub;
  }

  Future<void> cancel() async {
    if (_sub != null) {
      StreamSubscription sub = _sub!;
      _sub = null;
      await sub.cancel();
    }
  }

  Future<void> addDocument(
    CollectionReference<Map<String, dynamic>> ref,
    Map<String, dynamic> data,
  ) async {
    assert(_me?.id != null, 'Not authorized');
    await ref.add({
      ...data,
      FirestoreModel.fieldCreatedAt: DateTime.now(),
      FirestoreModel.fieldCreatedBy: _me!.id,
      FirestoreModel.fieldUpdatedAt: DateTime.now(),
      FirestoreModel.fieldUpdatedBy: _me!.id,
    });
  }

  Future<void> updateDocument(
    DocumentReference<Map<String, dynamic>> ref,
    Map<String, dynamic> data,
  ) async {
    assert(_me?.id != null, 'Not authorized');
    await ref.update({
      ...data,
      FirestoreModel.fieldUpdatedAt: DateTime.now(),
      FirestoreModel.fieldUpdatedBy: _me!.id,
    });
  }

  Future<void> deleteDocument(
    DocumentReference<Map<String, dynamic>> ref,
  ) async {
    assert(_me?.id != null, 'Not authorized');
    await ref.update({
      FirestoreModel.fieldDeletedAt: DateTime.now(),
      FirestoreModel.fieldDeletedBy: _me!.id,
    });
  }

  Future<void> restoreDocument(
    DocumentReference<Map<String, dynamic>> ref,
  ) async {
    assert(_me?.id != null, 'Not authorized');
    await ref.update({
      FirestoreModel.fieldUpdatedAt: DateTime.now(),
      FirestoreModel.fieldUpdatedBy: _me!.id,
      FirestoreModel.fieldDeletedAt: null,
      FirestoreModel.fieldDeletedBy: null,
    });
  }
}
