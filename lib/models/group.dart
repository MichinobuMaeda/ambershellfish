import 'package:cloud_firestore/cloud_firestore.dart';
import 'firestore_model.dart';

class Group extends FirestoreModel {
  static const fieldName = 'name';
  static const fieldDesc = 'desc';
  static const fieldAccounts = 'accounts';

  const Group(DocumentSnapshot<Map<String, dynamic>> snap) : super(snap);

  String get name => getValue<String>(fieldName, '');
  String get desc => getValue<String>(fieldDesc, '');
  List<String> get accounts => getListValue<String>(fieldAccounts, '');

  @override
  List<Object?> get props => super.props
    ..addAll([
      name,
      desc,
      accounts.join('\t'),
    ]);
}
