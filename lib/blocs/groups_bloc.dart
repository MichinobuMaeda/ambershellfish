import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../models/account.dart';
import '../models/group.dart';
import '../utils/firestore_deligate.dart';

abstract class GroupsEvent {}

class GroupsSubscribed extends GroupsEvent {
  final Account me;

  GroupsSubscribed(this.me);
}

class GroupsUnsubscribed extends GroupsEvent {}

class _GroupsOnSnapshot extends GroupsEvent {
  final List<DocumentSnapshot<Map<String, dynamic>>> docs;

  _GroupsOnSnapshot(this.docs);
}

class _GroupsOnError extends GroupsEvent {}

class GroupAdded extends GroupsEvent {
  final String name;
  final VoidCallback onError;

  GroupAdded(this.name, this.onError);
}

class GroupsBloc extends Bloc<GroupsEvent, List<Group>> {
  final FireStorereDeligate _firestore;
  late CollectionReference<Map<String, dynamic>> _ref;

  GroupsBloc({
    FirebaseFirestore? db,
  })  : _firestore = FireStorereDeligate(db ?? FirebaseFirestore.instance),
        super([]) {
    _ref = _firestore.db.collection('groups');

    on<GroupsSubscribed>((event, emit) {
      _firestore.subscribe(event.me);
      _firestore.listen(
        (event.me.admin
                ? _ref
                : _ref.where(Group.fieldAccounts, arrayContains: event.me.id))
            .snapshots()
            .listen(
          (querySnap) {
            add(_GroupsOnSnapshot(querySnap.docs));
          },
          onError: (Object error, StackTrace stackTrace) {
            debugPrint('$runtimeType:onError\n$error\n$stackTrace');
            add(_GroupsOnError());
          },
        ),
      );
    });

    on<_GroupsOnSnapshot>(
      (event, emit) => emit(event.docs.map((snap) => Group(snap)).toList()),
    );

    on<_GroupsOnError>((event, emit) => emit([]));

    on<GroupsUnsubscribed>((event, emit) async {
      await _firestore.unsubscribe();
      await _firestore.cancel();
      emit([]);
    });
  }

  Future<void> create(Map<String, dynamic> data) =>
      _firestore.addDocument(_ref, data);

  Future<void> update(String id, Map<String, dynamic> data) =>
      _firestore.updateDocument(_ref.doc(id), data);

  Future<void> delete(String id) => _firestore.deleteDocument(_ref.doc(id));

  Future<void> restore(String id) => _firestore.restoreDocument(_ref.doc(id));
}
